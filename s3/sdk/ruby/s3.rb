require 'aws-sdk-s3'    # Import AWS SDK for S3
require 'pry'           # Debugging tool
require 'securerandom'  # For generating unique IDs

# Get bucket name from environment variable
bucket_name = ENV['BUCKET_NAME']
region = 'us-east-1'

# Create an S3 client
s3 = Aws::S3::Client.new(region: region)

# Create an S3 bucket
resp = s3.create_bucket({
  bucket: bucket_name
})

#binding.pry  # Pauses execution for debugging

# Generate a random number of files (between 1 and 6)
number_of_files = 1 + rand(6)
puts "Number of files: #{number_of_files}"

number_of_files.times do |i|
  puts "Creating file #{i}"

  # Define file name and path
  filename = "file_#{i}.txt"
  output_path = "/tmp/#{filename}"

  # Write random UUID data to the file
  File.open(output_path, "w") do |f|
    f.write(SecureRandom.uuid)  # Generate a unique ID
  end

  # Upload the file to S3
  File.open(output_path, 'rb') do |f|
    s3.put_object(
      bucket: bucket_name,  # Use the actual bucket name
      key: filename,        # Use the actual filename
      body: f               # File data
    )
  end

  #puts "Uploaded #{filename} to S3"
end
