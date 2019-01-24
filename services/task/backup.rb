class BackUp

  attr_accessor :path, :credentials, :absolute_path

  MAX_BACKUPS_COUNT = 3

  def initialize(path = File.join(Dir.home, "backUP"))
    @path = path
    @credentials = Rails.application.config.database_configuration[Rails.env]
    @absolute_path = "#{ path }/#{ Time.now.strftime("%Y%m%d%H%M%S") }.sql"

  end

  def perform!
    backup_db
    remove_oldest
  end

  def remove_oldest
    number_of_files = Dir["#{ path }/*"].length
    count_of_oldest = number_of_files - MAX_BACKUPS_COUNT
    arr_files = Dir["#{ path }/*.sql"].sort_by {|f| File.mtime(f)}
    index = 0
    while index < count_of_oldest
      File.delete(arr_files[index])
      index += 1
    end
  end

  def backup_db
    Dir.mkdir(path) unless File.exists?(path)
    system "PGPASSWORD='#{ credentials['password'] }' pg_dump -U '#{ credentials['username'] }' -d '#{ credentials['database'] }' > #{ absolute_path }"
  end
end
