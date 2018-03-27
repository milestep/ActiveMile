class AddClientAndManagerIdsToRegisters < ActiveRecord::Migration[5.0]
  def change
    add_column :registers, :client_id, :integer
    add_column :registers, :sales_manager_id, :integer
  end
end
