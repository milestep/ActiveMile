class Api::V1::CounterpartiesController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!, only: :index
  
  expose :counterparties, -> {
    current_workspace.counterparties
  }
  expose :counterparty

  def index
    render_api(counterparties, :ok, each_serializer: CounterpartiesSerializer)
  end

  def create
    current_workspace.counterparties.create(counterparty_params)
    render_api(:created)
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
