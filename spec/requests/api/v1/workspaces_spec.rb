require 'spec_helper'

describe 'GET /api/v1/workspaces' do
  let!(:workspace_1) { create(:workspace) }
  let!(:workspace_2) { create(:workspace) }

  before do
    get '/api/v1/workspaces'
  end

  it 'retrives all workspaces' do
    expect(json).to eq([
      {
        'id'          => workspace_2.id,
        'title'       => workspace_2.title,
        'created_at'  => workspace_2.created_at.as_json,
        'updated_at'  => workspace_2.updated_at.as_json
      },
      {
        'id'          => workspace_1.id,
        'title'       => workspace_1.title,
        'created_at'  => workspace_1.created_at.as_json,
        'updated_at'  => workspace_1.updated_at.as_json
      }
    ])
  end
end
