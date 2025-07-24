# Plugin to post-process HTML PRE blocks to highlight marked sections
# Highlights sections marked with [<added>] and [<endadded>] comments

module Jekyll
  module HighlightPreBlocks
    
    def highlight_pre_blocks(content)
      # Process each PRE block in the content
      content.gsub(/<pre[^>]*>(.*?)<\/pre>/m) do |match|
        pre_content = $1
        
        # Check if this PRE block contains any markers
        if has_markers?(pre_content)
          process_pre_block(match, pre_content)
        else
          match
        end
      end
    end
    
    private
    
    def has_markers?(content)
      # Check for any markers in the format [<word>] or [&lt;word&gt;]
      content.match?(/\[(?:&lt;|<)\w+(?:&gt;|>)\]/)
    end
    
    def process_pre_block(original_pre, pre_content)
      # Extract pre tag attributes
      pre_tag_match = original_pre.match(/<pre([^>]*)>/)
      pre_attributes = pre_tag_match ? pre_tag_match[1] : ''
      
      # Split content into lines
      lines = pre_content.split(/\r?\n/)
      processed_lines = []
      current_markers = {}  # Track multiple active markers
      
      lines.each do |line|
        marker_info = extract_marker_info(line)
        
        if marker_info
          marker_name = marker_info[:name]
          is_end_marker = marker_info[:is_end]
          
          if is_end_marker
            # Remove the end marker from active markers
            current_markers.delete(marker_name)
          else
            # Add the start marker to active markers
            current_markers[marker_name] = true
          end
          
          # Skip marker lines (don't add them to output)
          next
        else
          # Process the line based on active markers
          processed_line = line
          current_markers.each_key do |marker_name|
            processed_line = wrap_line_with_highlight(processed_line, marker_name)
          end
          processed_lines << processed_line
        end
      end
      
      # Rebuild the PRE block with processed content
      "<pre#{pre_attributes}>#{processed_lines.join("\n")}</pre>"
    end
    
    def extract_marker_info(line)
      # Match patterns like [<added>], [&lt;highlight&gt;], [<endadded>], [&lt;endhighlight&gt;]
      if match = line.match(/\[(?:&lt;|<)(end)?(\w+)(?:&gt;|>)\]/)
        is_end_marker = !match[1].nil?
        marker_name = match[2]
        
        return {
          name: marker_name,
          is_end: is_end_marker
        }
      end
      
      nil
    end

    def wrap_line_with_highlight(line, css_class)
      # Wrap the entire line content with a highlight span using the specified CSS class
      # Preserve any existing HTML structure
      if line.strip.empty?
        line
      else
        # Find leading whitespace to preserve indentation
        leading_whitespace = line.match(/^\s*/)[0]
        content = line[leading_whitespace.length..-1]
        
        if content.empty?
          line
        else
          "#{leading_whitespace}<span class=\"#{css_class}\">#{content}</span>"
        end
      end
    end
  end
end

# Register the filter with Liquid
Liquid::Template.register_filter(Jekyll::HighlightPreBlocks)

# Create a helper class for the hooks
class HighlightPreBlocksProcessor
  include Jekyll::HighlightPreBlocks
end

# Hook into Jekyll's post-processing to apply the filter to all HTML content
Jekyll::Hooks.register :documents, :post_render do |document|
  if document.output_ext == '.html'
    processor = HighlightPreBlocksProcessor.new
    document.output = processor.highlight_pre_blocks(document.output)
  end
end

Jekyll::Hooks.register :pages, :post_render do |page|
  if page.output_ext == '.html'
    processor = HighlightPreBlocksProcessor.new
    page.output = processor.highlight_pre_blocks(page.output)
  end
end
