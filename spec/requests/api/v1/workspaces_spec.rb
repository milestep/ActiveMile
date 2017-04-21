require 'spec_helper'

describe 'GET /api/v1/workspaces' do
  let!(:workspace_1) { create(:workspace) }
  let!(:workspace_2) { create(:workspace) }

  before do
    get '/api/v1/workspaces'
  end

  it 'retrives all workspaces' do
    expect(json).to have(2).items
  end
end
