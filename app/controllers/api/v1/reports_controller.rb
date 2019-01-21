class Api::V1::ReportsController < Api::V1::BaseController
  # attr_accessor :val

  def index
    @totals = {
     "Total" => {
        "Revenue" => 0,
        "Cost" => 0,
        "Profit" => 0
      },
      "AVG" => {
        "Revenue" => 0,
        "Cost" => 0,
        "Profit" => 0
      }
    }
    report = {}
    months = request.headers["months"]
    year = request.headers["year"]

    report = counterparties_by_month(months, year).group_by{ |item| item['type'] }
    report.each { |key, val| report[key] = report[key].group_by{|item| item['title']} }
    report.each do |key, val|
      report[key].each do |key2, val2|
        report[key][key2] = group_by_month report[key][key2], months
      end
    end

    report.merge!( Hash[:totals, 
      @totals.each { |type, val|
        @totals["Total"][type] = val.inject(0, :+) if val.kind_of?(Array)
        @totals["AVG"][type] = AVG(val, months) if val.kind_of?(Array)
      }]
    )

    render_api(report, :ok)
  end

  private

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

  # def counterparty_params
  #   params.require(:counterparties).permit(:name, :date, :type, :active, :salary)
  # end
end
