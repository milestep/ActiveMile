class Api::V1::CounterpartiesController < Api::V1::BaseController
  expose :counterparty, -> { current_workspace.counterparties.find(params[:id]) }
  expose :counterparties, -> {
    current_workspace.counterparties
  }

  def index
    render_api(counterparties, :ok, each_serializer: CounterpartiesSerializer)
  end

  def create
    counterparty = current_workspace.counterparties.create(counterparty_params)
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
end
