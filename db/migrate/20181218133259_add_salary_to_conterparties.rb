class AddSalaryToConterparties < ActiveRecord::Migration[5.0]
  def change
    add_column :counterparties, :salary, :integer
  end
end