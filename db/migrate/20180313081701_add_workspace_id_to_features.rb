class AddWorkspaceIdToFeatures < ActiveRecord::Migration[5.0]
  def change
    add_column :features, :workspace_id, :integer, null: false
  end
end
