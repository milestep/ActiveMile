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

    items = registers.extract_by_date(props)
    sorted_items = items.sort { |a, b|  b.created_at <=> a.created_at }
    filtered_items = sorted_items.first(20)

    render_api({ items: filtered_items, years: registers.years },
                 :ok, each_serializer: RegistersSerializer)
  end

  def cast
    props = {
      years: params[:year],
      months: params[:month]
    }

    unless props_valid?(props)
      return render_api({ years: registers.years }, :ok)
    end

    items = registers.extract_by_date(props)
    sorted_items = items.sort { |a, b|  b.created_at <=> a.created_at }
    sliced_items = sorted_items.each_slice(20).to_a
    returned_items = sliced_items[params[:page]]

    render json: {}, status: 204 unless returned_items

    if returned_items
      render_api({ items: returned_items, years: registers.years },
                   :ok, each_serializer: RegistersSerializer)
    end
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
