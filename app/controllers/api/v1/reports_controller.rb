class Api::V1::ReportsController < Api::V1::BaseController
  before_action :validator

  def index
    totals
    report = {}
    months = request.headers["months"]
    year = request.headers["year"]

    report = counterparties_by_month(months, year).group_by{ |item| item['type'] }
    report.each_key { |clas| report[clas] = report[clas].group_by{|item| item['title']} }
    report.each_key do |clas|
      report[clas].each_key do |type|
        report[clas][type] = group_by_month report[clas][type], months
      end
    end

    report.merge!( Hash[:totals,
      @totals.each { |type, val|
        if val.kind_of?(Array)
          @totals["Total"][type] = val.inject(0, :+)
          @totals["AVG"][type] = AVG(val, months)
          @totals["Total"]["Profit"] = @totals["Total"]["Profit"] + @totals["Total"][type]
          @totals["AVG"]["Profit"] = ((@totals["AVG"]["Profit"] + @totals["AVG"][type]) * 100).to_i.to_f / 100
        end
      }]
    )

    render_api(report, :ok)
  end

  private

  def totals
    @totals = {
     "Total" => { "Revenue" => 0, "Cost" => 0, "Profit" => 0 },
      "AVG" => { "Revenue" => 0, "Cost" => 0, "Profit" => 0 }
    }
  end

  def add(a, b)
    a.map.with_index { |item, ind| item + b[ind] }
  end

  def AVG(val, months)
    (((val.inject(0, :+)) / months.split(',').length) * 100).to_i.to_f / 100
  end

  def group_by_month(obj, months)
    person_values = {}
    obj.each do |item|
      monthly_sums = Array.new(months.split(',').length, 0)
      item_index_of_month = (Date.parse item['date']).month - 1
      monthly_sums[item_index_of_month] += item['value']
      person_values.merge!( Hash[item['name'], monthly_sums] ) { |key, v1, v2| add(v1, v2) }
      @totals.merge!( Hash[item['type'], monthly_sums] ) { |key, v1, v2| add(v1, v2) }
    end
    return person_values
  end

  def counterparties_by_month(number_of_month, year)
    ActiveRecord::Base.connection.execute("
      SELECT registers.date, 
        CASE
          WHEN articles.type = 'Cost' THEN -registers.value
          ELSE registers.value
        END,
      counterparties.name, articles.type, articles.title
      FROM registers
      INNER JOIN counterparties ON counterparties.id = registers.counterparty_id
      INNER JOIN articles ON registers.article_id = articles.id
      WHERE registers.workspace_id = #{current_workspace.id}
      AND extract(year from registers.date) = #{year}
      AND extract(month from registers.date) IN (#{number_of_month})
    ")
  end

  def validator
    a = (/[0-9]/=~request.headers["months"][0]) != 0
    b = (/[0-9]/=~request.headers["year"][0]) != 0
    if (a || b)
      render_api({}, :ok)
    end
  end
end
