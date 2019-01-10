class Api::V1::ReportsController < Api::V1::BaseController
  def index
    @counterparties = []
    counterparties = current_workspace.counterparties.where(active: true)
    revenue = counterparties.where(type: 'Client').sum(:salary)
    costs = counterparties.where.not(type: 'Client').sum(:salary)

    counterparties.each do |var|
      @counterparties.push(ReportsSerializer.new(var))
    end

    bla = get_by_months request.headers["months"]

    @counterparties.push({ revenue: revenue, costs: costs, months: bla })
    render_api(@counterparties, :ok)
  end

  private

  def get_by_months(namberOfMonths)
    current_workspace.counterparties.where(active: true).by_months(namberOfMonths)
  end

  # def counterparty_params
  #   params.require(:counterparties).permit(:name, :date, :type, :active, :salary)
  # end
end



