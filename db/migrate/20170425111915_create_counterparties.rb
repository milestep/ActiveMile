class CreateCounterparties < ActiveRecord::Migration[5.0]
  def change
    create_table :counterparties do |t|
      t.string :name
      t.date :date
      t.string :type
      t.integer :workspace_id
    end
  end
end
