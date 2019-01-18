class BackupDb

  def initialize(path = File.join(Dir.home, "backUP"))
    remove_oldest(path)
  end

  def remove_oldest(path)
    Dir.mkdir(path) unless File.exists?(path)
    number_of_files = Dir["#{ path }/*"].length
    if number_of_files >= 3
      oldest_file = Dir["#{ path }/*.sql"].sort_by {|f| File.mtime(f)}.first
      File.delete(oldest_file)
    end
    absolute_path = "#{ path }/#{ Time.now.strftime("%Y%m%d%H%M%S") }.sql"
    backup_db(absolute_path)
  end

  def backup_db(absolute_path)
    credentials = Rails.application.config.database_configuration[Rails.env]
    if Rails.env == 'production'
      system "'PGPASSWORD=\"#{ credentials['password'] }\" pg_dump #{ credentials['database'] }' > #{ absolute_path }"
    else
      system "pg_dump #{ credentials['database'] } > #{ absolute_path }"
    end
  end
end