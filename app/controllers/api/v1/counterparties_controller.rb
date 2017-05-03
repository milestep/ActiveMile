class Api::V1::CounterpartiesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index
  
  expose :counterparty, -> { expose_counterparty }
  expose :counterparties, -> {
    current_workspace.counterparties
  }

  def index
    render_api(counterparties, :ok, each_serializer: CounterpartiesSerializer)
  end

  def create
    counterparty.save
    render_api(counterparty, :created)
  end

  def destroy
    if counterparty.destroy
      render json: {}, status: :ok
    else
      render json: {}, status: :internal_server_error
    end
  end

  private

  def counterparty_params
    params.require(:counterparty).permit(:name, :date, :type)
  end

  def expose_counterparty
    if id = params[:id]
      current_workspace.counterparties.find(id)
    else
      current_workspace.counterparties.new(counterparty_params)
    end
  end
end
