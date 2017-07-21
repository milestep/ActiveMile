class ChangeTypeValueInRegister < ActiveRecord::Migration[5.0]
  def change
    change_column :registers, :value, :float
  end
end
