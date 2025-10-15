import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/store';
import { updateQrCode } from '@/store/slices/attendanceSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import QRCode from 'qrcode';
import { QrCode, RefreshCw, Clock } from 'lucide-react';

interface QRGeneratorProps {
  sessionId: string;
}

const QRGenerator = ({ sessionId }: QRGeneratorProps) => {
  const dispatch = useAppDispatch();
  const [qrCode, setQrCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(6);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    setIsRegenerating(true);
    const timestamp = Date.now();
    const qrData = JSON.stringify({ sessionId, timestamp });

    try {
      const qrDataURL = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#6b46c1', // primary color
          light: '#ffffff',
        },
      });
      setQrCode(qrDataURL);
      dispatch(updateQrCode(qrData));
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setTimeout(() => setIsRegenerating(false), 300);
    }
  };

  useEffect(() => {
    generateQR();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateQR();
          return 6;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (timeLeft / 6) * 100;

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Attendance QR Code
        </CardTitle>
        <CardDescription>
          QR code refreshes every 6 seconds for security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="relative">
          <div
            className={`
              relative aspect-square w-full rounded-xl border-2 border-primary/20 
              bg-gradient-to-br from-primary/5 to-secondary/5 p-6
              flex items-center justify-center overflow-hidden
              transition-all duration-300
              ${isRegenerating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
            `}
          >
            {qrCode ? (
              <img
                src={qrCode}
                alt="Attendance QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <RefreshCw className="h-12 w-12 mx-auto mb-2 animate-spin" />
                <p>Generating QR Code...</p>
              </div>
            )}
          </div>
          
          {isRegenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl backdrop-blur-sm">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                <p className="text-sm font-medium text-primary">Refreshing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Timer and Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next refresh in</span>
            </div>
            <Badge variant="secondary" className="font-mono text-lg px-3 py-1">
              {timeLeft}s
            </Badge>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
        </div>

        {/* Instructions */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <p className="text-sm font-medium">Instructions:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Display this QR code to students</li>
            <li>Students scan with their mobile app</li>
            <li>Attendance is marked automatically</li>
            <li>QR refreshes every 6 seconds</li>
          </ul>
        </div>

        {/* Session Info */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Session ID:</span>
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
              {sessionId.slice(0, 8)}...
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRGenerator;
