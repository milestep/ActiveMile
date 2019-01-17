class Api::V1::ReportsController < Api::V1::BaseController
  def index
    report = {}
    months = request.headers["months"]
    year = request.headers["year"]

    counterparties_by_month(months, year).each do |item|

      # report[item['type']] = report.keys.include?(item['type']) ? report[item['type']] + '1' : '0'
      # counterparties_serialized.each {|key, value| puts "#{key} is #{value}" }

      # report[month] = { users: counterparties_serialized, revenue: cur_revenue, cost: cur_cost, profit: cur_profit }



      if report.keys.include?(item['type'])
        report[item['type']][item['title']] = {}
      else
        report[item['type']] = Hash[item['title'], {}]
      end
    end

    report[:total], report[:profit], report[:avg] = 0, 0, 0
    render_api(report, :ok)
  end

  private

  def counterparties_by_month(namber_of_month, year)
    ActiveRecord::Base.connection.execute("
      SELECT registers.date, registers.value, counterparties.name, articles.type, articles.title
      FROM registers 
      INNER JOIN counterparties ON counterparties.id = registers.counterparty_id
      INNER JOIN articles ON registers.article_id = articles.id
      WHERE registers.workspace_id = #{current_workspace.id}
      AND extract(year from registers.date) = #{year}
      AND extract(month from registers.date) IN (#{namber_of_month})
      ")
  end



  # def counterparty_params
  #   params.require(:counterparties).permit(:name, :date, :type, :active, :salary)
  # end
end
