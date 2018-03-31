class Api::V1::InventoryItemsController < Api::V1::BaseController
  def index
    items = current_user.inventory_items
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
    p '*****************'
    p 'destroy'
    p '*****************'
  end

  private

  def inventory_items_params
    params.require(:inventory_item).permit(:name, :date)
  end
end
