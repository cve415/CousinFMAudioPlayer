import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Copy, 
  Check,
  MessageCircle,
  Mail,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
  showLabels?: boolean;
}

export function ShareButtons({ url, title, description, showLabels = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The broadcast link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`🎵 ${title}\n\n${description}`);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
  };

  const shareOnFacebook = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`🎵 ${title}\n\n${description}\n\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this broadcast: ${title}`);
    const body = encodeURIComponent(`${description}\n\nListen here: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Native Share (Mobile) */}
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={shareViaWebAPI}
          className="text-white border-white hover:bg-white hover:text-black"
        >
          <Share2 className="h-4 w-4" />
          {showLabels && <span className="ml-2">Share</span>}
        </Button>
      )}

      {/* Copy Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="text-white border-white hover:bg-white hover:text-black"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {showLabels && <span className="ml-2">{copied ? "Copied!" : "Copy Link"}</span>}
      </Button>

      {/* Twitter */}
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="text-white border-white hover:bg-blue-500 hover:text-white hover:border-blue-500"
      >
        <Twitter className="h-4 w-4" />
        {showLabels && <span className="ml-2">Twitter</span>}
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnFacebook}
        className="text-white border-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
      >
        <Facebook className="h-4 w-4" />
        {showLabels && <span className="ml-2">Facebook</span>}
      </Button>

      {/* WhatsApp */}
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnWhatsApp}
        className="text-white border-white hover:bg-green-600 hover:text-white hover:border-green-600"
      >
        <MessageCircle className="h-4 w-4" />
        {showLabels && <span className="ml-2">WhatsApp</span>}
      </Button>

      {/* Email */}
      <Button
        variant="outline"
        size="sm"
        onClick={shareViaEmail}
        className="text-white border-white hover:bg-gray-600 hover:text-white hover:border-gray-600"
      >
        <Mail className="h-4 w-4" />
        {showLabels && <span className="ml-2">Email</span>}
      </Button>
    </div>
  );
}