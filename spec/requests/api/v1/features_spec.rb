require 'spec_helper'

describe 'SHOW /api/v1/features' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:request_params) {{
    access_token: access_token.token
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  context 'returns workspace features' do
    before do
      get '/api/v1/features/1',
        params: request_params,
        headers: request_headers
    end
    it { expect(response.status).to eq 200 }
  end

  context 'authentication failed' do
    before do
      get '/api/v1/features/1',
        headers: request_headers
    end
    it { expect(response.body).to eq '{"error":"Not authorized"}' }
  end
end

describe 'PATCH "/api/v1/features/1"' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:request_headers) {
    feature = {
      'workspace-id': workspace.id,
      'sales': false
    }
  }

  let(:request_params) {{
    access_token: access_token.token,
    feature: {
      sales: false
    }
  }}

  context 'update workspace features' do
    before do
      patch '/api/v1/features/1',
        params: request_params,
        headers: request_headers
    end
    it { expect(response.status).to eq 200 }
  end

  context 'authentication failed' do
    before do
      patch '/api/v1/features/1',
        headers: request_headers
    end
    it { expect(response.body).to eq '{"error":"Not authorized"}' }
  end
end
