class AddColumnToCounterparties < ActiveRecord::Migration[5.0]
  def change
    add_column :counterparties, :active, :boolean, default: true
  end
end
