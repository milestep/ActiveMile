require 'spec_helper'

describe 'GET /api/v1/inventory_items' do
  include_context :doorkeeper_app_with_token

  let(:item) { create(:inventory_item) }
  let(:request_params) {{ access_token: access_token.token }}

  let!(:item_1) { create(:inventory_item) }
  let!(:item_2) { create(:inventory_item) }

  context 'receive inventory items' do
    before do
      get '/api/v1/inventory_items',
        params: request_params
    end
    it { expect(response.status).to eq 200 }
  end

  context 'authentication failed' do
    before do
      get '/api/v1/inventory_items'
    end
    it { expect(response.body).to eq '{"error":"Not authorized"}' }
  end
end

describe 'POST /api/v1/inventory_items' do
  include_context :doorkeeper_app_with_token

  let(:valid_request_params) {{
    access_token: access_token.token,
    inventory_item: {
      name: 'Name',
      date: Date.new,
      id: 1
    }
  }}

  let(:invalid_request_params) {{
    access_token: access_token.token
  }}

  context 'create inventory items' do
    before do
      post '/api/v1/inventory_items',
        params: valid_request_params
    end
    it 'returns a successful response' do
      expect(response).to be_success
    end
  end
end

describe 'PATCH /api/v1/inventory_items/:id' do
  include_context :doorkeeper_app_with_token

  let(:item_params) {{ id: 1, name: 'aaa', date: Date.new }}
  let!(:inventory_item) { create(:inventory_item, item_params) }

  let(:valid_request_params) {{
    access_token: access_token.token,
    inventory_item: {
      name: 'Name',
      date: Date.new,
      id: 1
    }
  }}

  let(:invalid_request_params) {{
    inventory_item: {
      name: 'Name',
      date: Date.new,
      id: 1
    }
  }}

  context 'update inventory items' do
    before do
      patch "/api/v1/inventory_items/1",
        params: valid_request_params
    end
    it { expect(response.status).to eq 200 }
  end

  context 'will result an error' do
    before do
      patch "/api/v1/inventory_items/1"
    end
    it { expect(response.status).to eq 401 }
  end

  context 'will result an error' do
    before do
      patch "/api/v1/inventory_items/1",
        params: invalid_request_params
    end
    it { expect(response.status).to eq 401 }
  end
end

describe 'DELETE /api/v1/inventory_items/1' do
  include_context :doorkeeper_app_with_token

  let(:item_params) {{ id: 1, name: 'aaa', date: Date.new }}
  let!(:inventory_item) { create(:inventory_item, item_params) }

  let(:valid_request_params) {{
    access_token: access_token.token,
    inventory_item: {
      name: 'Name',
      date: Date.new,
      id: 1
    }
  }}

  context 'delete inventory item' do
    before do
      delete "/api/v1/inventory_items/1",
        params: valid_request_params
    end
    it 'returns a successful response' do
      expect(response).to be_success
    end
  end
end

describe 'SHOW /api/v1/inventory_items/1' do
  include_context :doorkeeper_app_with_token

  let(:item_params) {{ id: 1, name: 'aaa', date: Date.new }}
  let!(:inventory_item) { create(:inventory_item, item_params) }

  let(:valid_request_params) {{
    access_token: access_token.token,
    inventory_item: {
      name: 'Name',
      date: Date.new,
      id: 1
    }
  }}

  context 'receive inventory item' do
    before do
      get "/api/v1/inventory_items/1",
        params: valid_request_params
    end
    it 'returns a successful response' do
      expect(response).to be_success
    end
  end
end
