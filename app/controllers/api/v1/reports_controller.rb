class Api::V1::ReportsController < Api::V1::BaseController

  def index
    # @counterparties = Counterparty.all
    @counterparties = current_workspace
    render json: @counterparties, status: :ok
    # render json: {asd: "asd"}, status: :ok
    # render_api(counterparties, :ok, each_serializer: CounterpartiesSerializer)
  end

  # def create
  #   counterparty = current_workspace.counterparties.create(counterparty_params)
  #   render_api(counterparty, :created)
  # end

  # def update
  #   counterparty.update(counterparty_params)
  #   render_api(counterparty, :accepted)
  # end

  # def destroy
  #   if counterparty.destroy
  #     render json: {}, status: :ok
  #   else
  #     render json: {}, status: :internal_server_error
  #   end
  # end

  # private

  # def counterparty_params
  #   params.require(:counterparties).permit(:name, :date, :type, :active, :salary)
  # end
end



