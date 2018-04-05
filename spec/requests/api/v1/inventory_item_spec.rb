require 'spec_helper'

describe 'GET /api/v1/inventory_items' do
  include_context :doorkeeper_app_with_token

  let(:request_params) {{ access_token: access_token.token }}

  context 'receive inventory items' do
    before do
      get '/api/v1/inventory_items',
        params: request_params
    end
    it 'returns a successful response' do
      expect(response.status).to eq 200
    end
  end

  context 'authentication failed' do
    before do
      get '/api/v1/inventory_items'
    end
    it 'returns a bad response' do
      expect(response.body).to eq '{"error":"Not authorized"}'
    end
  end
end

describe 'POST /api/v1/inventory_items' do
  include_context :doorkeeper_app_with_token

  let(:valid_request_params) {{
    access_token: access_token.token,
    inventory_item: {
      name: 'Name',
      date: Date.new
    }
  }}

  let(:invalid_request_params) {{
    inventory_item: {
      name: 'Name',
      date: Date.new
    }
  }}

  context 'create inventory item' do
    before do
      post '/api/v1/inventory_items',
        params: valid_request_params
    end
    it 'returns a successful response' do
      expect(response).to be_success
    end
  end

  context 'authentication failed' do
    before do
      post '/api/v1/inventory_items',
        params: invalid_request_params
    end
    it 'returns a bad response' do
      expect(response.body).to eq '{"error":"Not authorized"}'
    end
  end
end

describe 'PATCH /api/v1/inventory_items/:id' do
  include_context :doorkeeper_app_with_token

  let(:user)            { create(:user) }
  let(:item_params)     {{ user: user }}
  let!(:inventory_item) { create(:inventory_item, item_params) }

  let(:valid_request_params) {{
    access_token: access_token.token,
    inventory_item: {
      name: 'Name',
      date: Date.new
    }
  }}

  let(:invalid_request_params) {{
    inventory_item: {
      name: 'Name',
      date: Date.new
    }
  }}

  context 'update inventory item' do
    before do
      patch "/api/v1/inventory_items/#{inventory_item.id}",
        params: valid_request_params
    end
    it 'returns a successful response' do
      expect(response.status).to eq 200
    end
  end

  context 'authentication failed' do
    before do
      patch "/api/v1/inventory_items/#{inventory_item.id}"
    end
    it 'returns a bad response' do
      expect(response.body).to eq '{"error":"Not authorized"}'
    end
  end

  context 'authentication failed' do
    before do
      patch "/api/v1/inventory_items/#{inventory_item.id}",
        params: invalid_request_params
    end
    it 'returns a bad response' do
      expect(response.body).to eq '{"error":"Not authorized"}'
    end
  end
end

describe 'DELETE /api/v1/inventory_items/:id' do
  include_context :doorkeeper_app_with_token

  let(:user)                 { create(:user) }
  let(:item_params)          {{ user: user }}
  let!(:inventory_item)      { create(:inventory_item, item_params) }
  let(:valid_request_params) {{ access_token: access_token.token }}

  context 'delete inventory item' do
    before do
      delete "/api/v1/inventory_items/#{inventory_item.id}",
        params: valid_request_params
    end
    it 'returns a successful response' do
      expect(response).to be_success
    end
  end

  context 'authentication failed' do
    before do
      delete "/api/v1/inventory_items/#{inventory_item.id}"
    end
    it 'returns a bad response' do
      expect(response.body).to eq '{"error":"Not authorized"}'
    end
  end
end

describe 'SHOW /api/v1/inventory_items/:id' do
  include_context :doorkeeper_app_with_token

  let(:user)                 { create(:user) }
  let(:item_params)          {{ user: user }}
  let!(:inventory_item)      { create(:inventory_item, item_params) }
  let(:valid_request_params) {{ access_token: access_token.token }}

  context 'receive inventory item' do
    before do
      get "/api/v1/inventory_items/#{inventory_item.id}",
        params: valid_request_params
    end
    it 'returns a successful response' do
      expect(response).to be_success
    end
  end

  context 'authentication failed' do
    before do
      get "/api/v1/inventory_items/#{inventory_item.id}"
    end
    it 'returns a successful response' do
      expect(response.body).to eq '{"error":"Not authorized"}'
    end
  end
end
