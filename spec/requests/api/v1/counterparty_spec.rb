require 'spec_helper'

describe 'GET /api/v1/counterparties' do
  context "FETCH TASKS" do
    it "valid" do
      get '/api/v1/counterparties'
      #, params: {  }, headers: { "workspace-id" => counterparty_1.workspace_id }
      expect(response.status).to eq(200)
    end
  end

  # NOT WORKS

  # include_context :doorkeeper_app_with_token

  # let(:request_params) {
  #   {
  #     access_token: access_token.token
  #   }
  # }

  # context "CREATE TASKS" do
  #   let(:counterparty) { FactoryGirl.build(:counterparty) }
    
  #   it "valid" do
  #     post '/api/v1/counterparties/',
  #       params: request_params,
  #       params:{
  #         name: counterparty.name, 
  #         date: counterparty.date, 
  #         type: counterparty.type
  #       },
  #       headers: {
  #         "workspace-id" => 1,
  #         "access_token" => access_token
  #       }

  #     expect(response.status).to eq(201)
  #   end
  # end
end
