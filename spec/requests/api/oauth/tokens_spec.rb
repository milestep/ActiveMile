require 'spec_helper'

describe 'POST /api/oauth/token' do
  include_context :doorkeeper_app_with_token

  context 'returns access token' do
    let(:request_params) {
      {
        access_token: access_token.token,
        grant_type: 'password',
        email: user.email,
        password: user.password
      }
    }

    before do
      post "/api/oauth/token", params: request_params
    end

    it { expect(json['access_token']).to be }
    it { expect(json['token_type']).to eq 'bearer' }
    it { expect(json.keys.count).to eq 4 }
  end
end
