class AddColumnToInventoryItems < ActiveRecord::Migration[5.0]
  def change
    add_column :inventory_items, :workspace_id, :integer, null: false
  end
end
