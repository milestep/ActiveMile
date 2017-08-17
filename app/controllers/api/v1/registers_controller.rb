class Api::V1::RegistersController < Api::V1::BaseController
  expose :register, -> {
    current_workspace.registers.find(params[:id])
  }
  expose :registers, -> {
    current_workspace.registers.order(date: :desc)
  }

  def index
    year = Integer(request.headers['year'])
    month = request.headers['month'].split(/,/)

    month.each_with_index{|value, key|
      month[key] = Integer(month[key]) + 1
    }

    render_api({ items: registers.get_registers_by_date(year, month), years: registers.years}, :ok, each_serializer: RegistersSerializer)
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

  def register_params
    params.require(:register).permit(:date, :value, :note, :article_id, :counterparty_id)
  end
end
