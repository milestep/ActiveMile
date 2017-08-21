require 'spec_helper'

describe 'GET /api/v1/articles' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:article_params) {{
    workspace: workspace
  }}

  let!(:article_1) { create(:article, article_params) }
  let!(:article_2) { create(:article, article_params) }

  let(:request_params) {{
    access_token: access_token.token
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  context 'returns all article' do
    before do
      get '/api/v1/articles',
        params: request_params,
        headers: request_headers
    end

    it 'retrives all articles' do
      expect(json).to have(2).items
    end
  end

  context 'authentication failed' do
    before do
      get '/api/v1/articles',
        headers: request_headers
    end

    it { expect(response.body).to eq '{"error":"Not authorized"}' }
  end
end

describe 'POST /api/v1/articles' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  let(:request_params) {{
    access_token: access_token.token,
    article: {
      title: 'Розробка',
      type: 'Revenue',
    }
  }}

  before do
    post '/api/v1/articles',
        params: request_params,
        headers: request_headers
  end

  it 'returns a successful 201 response' do
    expect(response).to be_success
  end
end

describe 'PATCH /api/v1/articles/:id' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:article_params) {{
    workspace: workspace
  }}

  let!(:article) { create(:article, article_params) }

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  let(:request_params) {{
    access_token: access_token.token,
    article: {
      title: 'ЗП'
    }
  }}

  before do
    patch "/api/v1/articles/#{article.id}",
      params: request_params,
      headers: request_headers
    article.reload
  end

  it 'returns a successful 201 response' do
    expect(response).to be_success
  end

  it 'successfully update article attributes' do
    expect(article.title).to eq('ЗП')
  end
end

describe 'DELETE /api/v1/articles/:id' do
  include_context :doorkeeper_app_with_token

  let(:workspace) { create(:workspace) }

  let(:article_params) {{
    workspace: workspace
  }}

  let(:request_params) {{
    access_token: access_token.token
  }}

  let(:request_headers) {{
    'workspace-id': workspace.id
  }}

  let!(:article) { create(:article, article_params) }

  it {
    expect {
      delete "/api/v1/articles/#{article.id}",
      params: request_params,
      headers: request_headers
    }.to change{ workspace.articles.count }.from(1).to(0)
  }
end
