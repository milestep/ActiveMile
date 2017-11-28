class AddRegistersCount < ActiveRecord::Migration[5.0]
  def change
    add_column :counterparties, :registers_count, :integer, default: 0
  end
end
