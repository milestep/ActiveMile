Rails.application.routes.draw do
  use_doorkeeper

  scope 'api' do
    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
    end

    post '/oauth/token', to: 'doorkeeper/tokens#create'
    post '/oauth/revoke', to: 'doorkeeper/tokens#revoke'
  end

  root to: 'doorkeeper/applications#index'
end
