class CreateInventoryItems < ActiveRecord::Migration[5.0]
  def change
    create_table :inventory_items do |t|
      t.string :name
      t.date :date
      t.integer :user_id

      t.timestamps
    end
  end
end
