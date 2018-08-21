class Api::V1::RegistersController < Api::V1::BaseController
  expose :registers, -> { current_workspace.registers }
  expose :register,  -> { registers.find(params[:id]) }

  def index
    props = {
      years: params[:year],
      months: params[:month]
    }

    unless props_valid?(props)
      return render_api({ years: registers.years }, :ok)
    end

    items = registers.extract_by_date(props).by_page(params[:page]) 

    next_page_registers = registers.extract_by_date(props).by_page(params[:page].to_i + 1)

    if next_page_registers.length == 0
      has_more_items = false 
    else
      has_more_items = true
    end   
 
    render_api({ items: items, years: registers.years, has_more_items: has_more_items },
                 :ok, each_serializer: RegistersSerializer)
  end

  def show
    return render_api(register) if register
    render json: { errors: I18n.t('register.show.error.not_found') }, status: 404
  end

  def create
    register = current_workspace.registers.create(register_params)
    render_api(register, :created)
  end

  def update
    register.update(register_params)
    render_api(register, :accepted)
  end

  def destroy
    register.destroy
    render json: {}, status: :ok
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
