require 'spec_helper'

describe 'GET /api/v1/reports' do
  include_context :doorkeeper_app_with_token

  let(:workspace)    { create(:workspace) }

  let(:request_headers) {{
    'workspace-id' => workspace.id
  }}

  context 'without parameters' do

    let(:request_params_without_page) {{
      year: Date.current.year.to_s,
      month: Date.current.mon.to_s, 
      access_token: access_token.token
    }}

    before do
      get '/api/v1/reports',
      params: request_params_without_page,
      headers: request_headers
    end

    it 'retrives all registers' do
      expect(json['items']).to have(registers.length).items
    end
  end
end
