class CreateCounterparties < ActiveRecord::Migration[5.0]
  def change
    create_table :counterparties do |t|
      t.string :name
      t.date :date
      t.string :type
      t.references :workspace, foreign_key: true

      t.timestamps
    end
  end
end
