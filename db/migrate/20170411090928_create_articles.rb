class CreateArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :articles do |t|
      t.string :title
      t.string :type
      t.references :workspace, foreign_key: true

      t.timestamps
    end
  end
end
