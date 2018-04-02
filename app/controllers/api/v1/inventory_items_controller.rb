class Api::V1::InventoryItemsController < Api::V1::BaseController
  expose :item, -> { InventoryItem.find(params[:id]) }
  expose :items, -> { current_user.inventory_items }

  def index
    render_api(items, :ok, each_serializer: InventoryItemsSerializer)
  end

  def create
    current_user.inventory_items.create(inventory_items_params)
  end

  def update
    p '*****************'
    p 'update'
    p '*****************'
  end

  def destroy
    item.destroy
    render json: {}, status: :ok
  end

  def show
    render_api(item, :ok, each_serializer: InventoryItemSerializer)
  end

  private

  def inventory_items_params
    params.require(:inventory_item).permit(:name, :date)
  end
end
