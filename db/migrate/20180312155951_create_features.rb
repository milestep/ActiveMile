class CreateFeatures < ActiveRecord::Migration[5.0]
  def change
    create_table :features do |t|
      t.boolean :sales, default: false, null: false
    end
  end
end
