require 'spec_helper'

describe 'GET /api/v1/registers' do
  include_context :doorkeeper_app_with_token

  let(:workspace)    { create(:workspace) }
  let(:article)      { create(:article) }
  let(:counterparty) { create(:counterparty) }

  let(:register_params) {{
    workspace: workspace,
    article: article,
    counterparty: counterparty
  }}

  let!(:register_1) { create(:register, register_params) }
  let!(:register_2) { create(:register, register_params) }

  let(:request_params) {{
    access_token: access_token.token
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id,
    'year': 2.days.ago.year.to_s,
    'month': 2.days.ago.mon.to_s
  }}

  context 'returns all registers' do
    before do
      get '/api/v1/registers',
        params: request_params,
        headers: request_headers
    end

    it 'retrives all registers' do
      expect(json).to have(2).items
    end
  end

  context 'authentication failed' do
    before do
      get '/api/v1/registers',
        headers: request_headers
    end

    it { expect(response.body).to eq '{"error":"Not authorized"}' }
  end
end

describe 'POST /api/v1/registers' do
  include_context :doorkeeper_app_with_token

  let(:workspace)    { create(:workspace) }
  let(:article)      { create(:article) }
  let(:counterparty) { create(:counterparty) }

  let(:request_params) {{
    access_token: access_token.token,
    register: {
      date: Date.tomorrow.to_s,
      value: 2,
      note: 'note',
      article_id: article.id,
      counterparty_id: counterparty.id,
    }
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  before do
    post '/api/v1/registers',
        params: request_params,
        headers: request_headers
  end

  it 'returns a successful 201 response' do
    expect(response).to be_success
  end
end

describe 'PATCH /api/v1/registers/:id' do
  include_context :doorkeeper_app_with_token

  let(:workspace)    { create(:workspace) }
  let(:article)      { create(:article) }
  let(:counterparty) { create(:counterparty) }

  let(:register_params) {{
    workspace: workspace,
    article: article,
    counterparty: counterparty
  }}

  let!(:register) { create(:register, register_params) }

  let(:request_params) {{
    access_token: access_token.token,
    register: {
      note: 'The simple note'
    }
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  before do
    patch "/api/v1/registers/#{register.id}",
          params: request_params,
          headers: request_headers
    register.reload
  end

  it 'returns a successful 201 response' do
    expect(response).to be_success
  end

  it 'successfully update register attributes' do
    expect(register.note).to eq('The simple note')
  end
end

describe 'DELETE /api/v1/registers/:id' do
  include_context :doorkeeper_app_with_token

  let(:workspace)    { create(:workspace) }
  let(:article)      { create(:article) }
  let(:counterparty) { create(:counterparty) }

  let(:register_params) {{
    workspace: workspace,
    article: article,
    counterparty: counterparty
  }}

  let(:request_params) {{
    access_token: access_token.token
  }}
  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  let!(:register) { create(:register, register_params) }

  it {
    expect {
      delete "/api/v1/registers/#{register.id}",
      params: request_params,
      headers: request_headers
    }.to change{ workspace.registers.count }.from(1).to(0)
  }
end
