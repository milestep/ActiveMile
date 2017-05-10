class Api::V1::RegistersController < Api::V1::BaseController
  expose :register, -> { current_workspace.registers.find(params[:id]) }
  expose :registers, -> {
    current_workspace.registers.order(id: :asc) 
  }

  def index
    render_api(registers, :ok, each_serializer: RegistersSerializer)
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
