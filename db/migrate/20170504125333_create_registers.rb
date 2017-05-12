class CreateRegisters < ActiveRecord::Migration[5.0]
  def change
    create_table :registers do |t|
      t.date :date
      t.integer :value
      t.text :note
      t.references :workspace, foreign_key: true
      t.references :article, foreign_key: true
      t.references :counterparty, foreign_key: true

      t.timestamps
    end
  end
end
