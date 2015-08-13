#!/usr/bin/ruby

require 'fileutils'
require 'optparse'

options = {
  rough: false,
  half_frames: false
}
optparser = OptionParser.new do |opts|
  opts.banner = "Usage: animate.rb [options] <animation_name>"

  opts.on("--rough", "Preview render at 1/4x size") do
    options[:rough] = true
  end

  opts.on("--half-fps", "Use half the frames") do
    options[:half_frames] = true
  end
end
optparser.parse!

def run(cmd)
  puts cmd
  system(cmd)
end

if ARGV.length == 0
  puts optparser
  exit
end

name = ARGV[0]
# /bin/sh doesn't do {1,3,5,7,9}* syntax.
glob = options[:half_frames] ? [1, 3, 5, 7, 9].map { |i| "#{name}*#{i}.png" }.join(' ') : "#{name}*.png"
run("python anim_encoder.py #{name} #{options[:rough]} #{glob}")
