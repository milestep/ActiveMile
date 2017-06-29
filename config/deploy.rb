lock "3.8.0"

branch = ENV['BRANCH'] || 'master'
user = ENV['USER'] || 'midnight'

set :application, "activemile"
set :repo_url, "git@github.com:milestep/ActiveMile.git"
set :passenger_restart_with_touch, true
set :deploy_to, "/home/#{user}/apps/activemile"
set :linked_files, %w(config/database.yml config/application.yml config/secrets.yml client/config/prod.json)
set :linked_dirs, %w(log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system node_modules)
set :bundle_binstubs, nil
set :branch, branch
set :puma_rackup, -> { File.join(current_path, 'config.ru') }
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
set :puma_bind, "unix://#{shared_path}/tmp/sockets/puma.sock"
set :puma_conf, "#{shared_path}/puma.rb"
set :puma_access_log, "#{shared_path}/log/puma_error.log"
set :puma_error_log, "#{shared_path}/log/puma_access.log"
set :puma_role, :app
set :puma_env, fetch(:rack_env, fetch(:rails_env, 'production'))
set :puma_threads, [0, 16]
set :puma_workers, default: 2
set :puma_init_active_record, true
set :puma_preload_app, true
set :keep_releases, 5

namespace :puma do
  desc 'Create Directories for Puma Pids and Socket'
  task :make_dirs do
    on roles(:app) do
      execute "mkdir #{shared_path}/tmp/sockets -p"
      execute "mkdir #{shared_path}/tmp/pids -p"
    end
  end

  before :start, :make_dirs
end

namespace :npm do
  task :install do
    on roles :app do
      within release_path do
        execute :npm, :install
      end
    end
  end
end

namespace :npm do
  task :build do
    on roles :app do
      within release_path do
        execute :mkdir, 'client/dist'
        execute :npm, 'run', 'build'
      end
    end
  end
end

namespace :deploy do
  desc 'Initial Deploy'
  task :initial do
    on roles(:app) do
      before 'deploy:restart', 'puma:start'
      invoke 'deploy'
    end
  end

  after  :finishing,    :compile_assets
  after  :finishing,    :cleanup
  after  :finishing,    :restart
end

after 'deploy:updating', 'npm:install'
after 'deploy:updating', 'npm:build'
