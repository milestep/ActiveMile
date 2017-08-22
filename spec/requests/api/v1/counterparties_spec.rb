require 'spec_helper'

describe 'GET /api/v1/counterparties' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:counterparty_params) {{
    workspace: workspace
  }}

  let!(:counterparty_1) { create(:counterparty, counterparty_params) }
  let!(:counterparty_2) { create(:counterparty, counterparty_params) }

  let(:request_params) {{
    access_token: access_token.token
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  context 'returns all counterparty' do
    before do
      get '/api/v1/counterparties',
        params: request_params,
        headers: request_headers
    end

    it 'retrives all counterparties' do
      expect(json).to have(2).items
    end
  end

  context 'authentication failed' do
    before do
      get '/api/v1/counterparties',
        headers: request_headers
    end

    it { expect(response.body).to eq '{"error":"Not authorized"}' }
  end
end

describe 'POST /api/v1/counterparties' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  let(:request_params) {{
    access_token: access_token.token,
    counterparty: {
      name: 'Anton',
      date: Date.tomorrow.to_s,
      type: 'Client',
    }
  }}

  before do
    post '/api/v1/counterparties',
        params: request_params,
        headers: request_headers
  end

  it 'returns a successful 201 response' do
    expect(response).to be_success
  end
end

describe 'PATCH /api/v1/counterparties/:id' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:counterparty_params) {{
    workspace: workspace
  }}

  let!(:counterparty) { create(:counterparty, counterparty_params) }

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  let(:request_params) {{
    access_token: access_token.token,
    counterparty: {
      name: 'Richard'
    }
  }}

  before do
    patch "/api/v1/counterparties/#{counterparty.id}",
      params: request_params,
      headers: request_headers
    counterparty.reload
  end

  it 'returns a successful 201 response' do
    expect(response).to be_success
  end

  it 'successfully update counterparty attributes' do
    expect(counterparty.name).to eq('Richard')
  end
end

describe 'DELETE /api/v1/counterparties/:id' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:counterparty_params) {{
    workspace: workspace
  }}

  let(:request_params) {{
    access_token: access_token.token
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  let!(:counterparty) { create(:counterparty, counterparty_params) }

  it {
    expect {
      delete "/api/v1/counterparties/#{counterparty.id}",
      params: request_params,
      headers: request_headers
    }.to change{ workspace.counterparties.count }.from(1).to(0)
  }
end
