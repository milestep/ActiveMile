class Api::V1::ReportsController < Api::V1::BaseController
  expose :registers, -> { current_workspace.registers }

  def index
    puts; puts; puts
    p params[:counterparty_id]
    puts; puts; puts
    props = {
      years: params[:year],
      months: params[:month]
    }

    unless props_valid?(props)
      return render_api({ items: {}, years: registers.years }, :ok)
    end

    items = registers.extract_by_date(props).by_page(params[:page]).order(created_at: :desc) 
    render_api({ items: items, years: registers.years },
                 :ok, each_serializer: RegistersSerializer)
  end

  private

  def props_valid?(props)
    filter_by = params[:filter_by]
    return true unless filter_by
    return false if props[filter_by.to_sym].nil?
    true
  end

  def register_params
    params.require(:register).permit(:date, :value, :note,
                                     :article_id, :counterparty_id,
                                     :client_id, :sales_manager_id)
  end
end
