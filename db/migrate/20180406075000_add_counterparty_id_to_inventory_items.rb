class AddCounterpartyIdToInventoryItems < ActiveRecord::Migration[5.0]
  def change
    add_column :inventory_items, :counterparty_id, :integer
  end
end
