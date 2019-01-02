class AddDefaultToSalary < ActiveRecord::Migration[5.0]
  def change
    change_column :counterparties, :salary, :integer, default: 0
    Counterparty.where("salary is null").update_all(salary: 0)
  end
end
