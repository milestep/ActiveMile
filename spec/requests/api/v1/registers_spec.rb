require 'spec_helper'

describe 'GET /api/v1/registers' do
  include_context :doorkeeper_app_with_token

  let(:workspace)    { create(:workspace) }
  let(:article)      { create(:article) }
  let(:counterparty) { create(:counterparty) }

  let(:request_headers) {{
    'workspace-id' => workspace.id
  }}

  context 'return registers' do
    let(:register_params) {{
      workspace: workspace,
      article: article,
      counterparty: counterparty
    }}
  
    let!(:registers) {create_list(:register, 26, register_params)}
      
    context 'with page parameter' do
      let(:request_params) {{
        year: Date.current.year.to_s,
        month: Date.current.mon.to_s, 
        access_token: access_token.token,
        page: 0
      }}
  
      before do
        get '/api/v1/registers',
          params: request_params,
          headers: request_headers
      end
  
      it 'retrives 20 registers' do
        expect(json["items"]).to have(20).items
      end
    end
  
    context 'without page parameter' do
      let(:request_params_without_page) {{
        year: Date.current.year.to_s,
        month: Date.current.mon.to_s, 
        access_token: access_token.token
      }}
  
      before do
        get '/api/v1/registers',
          params: request_params_without_page,
          headers: request_headers
      end
  
      it 'retrives all registers' do
        expect(json['items']).to have(registers.length).items
      end
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
