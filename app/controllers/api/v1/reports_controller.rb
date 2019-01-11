class Api::V1::ReportsController < Api::V1::BaseController
  def index
    @report = {}
    @months = request.headers["months"].split(",")

    @months.each do |month|
      counterparties_serialized = []
      month = month.to_i + 1
      counterparties = get_counterparties_by_months(month)
      cur_revenue = counterparties.where(type: 'Client').sum(:salary)
      cur_cost = counterparties.where.not(type: 'Client').sum(:salary)
      cur_counts = {revenue: cur_revenue, cost: cur_cost}

      counterparties.each do |var|
        counterparties_serialized.push(ReportsSerializer.new(var))
      end

      @report[month] = { users: counterparties_serialized, counts: cur_counts }
    end

    render_api(@report, :ok)
  end

  private

  def get_counterparties_by_months(namberOfMonths)
    current_workspace.counterparties.where(active: true).by_year(2018).by_months(namberOfMonths)
  end

  # def counterparty_params
  #   params.require(:counterparties).permit(:name, :date, :type, :active, :salary)
  # end
end



