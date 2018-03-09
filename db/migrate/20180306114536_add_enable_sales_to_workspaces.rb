class AddEnableSalesToWorkspaces < ActiveRecord::Migration[5.0]
  def change
    add_column :workspaces, :sales, :boolean, default: false
  end
end
