class Api::V1::InventoryItemsController < Api::V1::BaseController
  expose :item, -> { InventoryItem.find(params[:id]) }
  expose :items, -> { InventoryItem.all }

  def index
    render_api(items, :ok, each_serializer: InventoryItemsSerializer)
  end

  def create
    created_item = items.create(inventory_items_params)
    render_api(created_item.id, :created)
  end

  def update
    item.update(inventory_items_params)
    render_api(:accepted)
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
