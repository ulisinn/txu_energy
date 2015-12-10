package
{
	import flash.display.LoaderInfo;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.external.ExternalInterface;
	import flash.media.SoundTransform;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	
	
	public class VideoPlayerComponent extends MovieClip
	{
		protected var video:Video;
		protected var vidConn:NetConnection;
		protected var vidStream:NetStream;
		protected var _url:String;
		protected var _currentPosition:Number;
		protected var _totalDuration:Number;
		
		
		public function VideoPlayerComponent()
		{
			super();
			ExternalInterface.addCallback("pauseVideo", pauseVideo);
			ExternalInterface.addCallback("resumeVideo", resumeVideo);
			ExternalInterface.addCallback("setVolume", setVolume);
			ExternalInterface.addCallback("getDuration", getDuration);
			ExternalInterface.addCallback("getCurrentTime", getCurrentTime);
			ExternalInterface.addCallback("seekToInVideo", seekToInVideo);

			this.addEventListener(Event.ADDED_TO_STAGE,onAddedToStage);
		}
		
		
		function onAddedToStage(evt:Event):void{
			var vidSrc:String = this.stage.loaderInfo.parameters["videoSource"];
			if(!vidSrc){
				vidSrc = "http://brightcove.vo.llnwd.net/pd15/media/2010734891001/201403/796/2010734891001_3358272429001_TXU-Intro-920x518-Brightcove-H264-AAC.mp4";
			}
			//			this["label_tf"].text  = vidSrc
			_url = vidSrc;
			createVideoObject();
			
		}
		protected function createVideoObject():void{
			vidConn = new NetConnection();
			vidConn.connect(null);
			
			vidStream = new NetStream(vidConn);
			vidStream.client={onMetaData:onMetaData }
			
			video = new Video(920,516);
			video.name = "videoPlayer";
			this.addChild(video);
			video.attachNetStream(vidStream);
			vidStream.play(_url);
			
			//			vidStream.pause();
		}
		
		public function onMetaData(obj:Object):void{
			_totalDuration = int(obj.duration * 1000)-500;
			_currentPosition = vidStream.time * 1000
			//			trace("onMetaData", video.name, _totalDuration, _currentPosition);
			if (ExternalInterface.available)
			{
				ExternalInterface.call("onFlashMetaData",_totalDuration, _currentPosition);
			}
			this.addEventListener(Event.ENTER_FRAME,onTick);
		}
		
		public function onTick(e:Event):void{
			_currentPosition = Math.floor(vidStream.time * 1000);
			var endTotal:Number = Math.floor(_totalDuration/1000);
			var current:Number = Math.floor(_currentPosition/1000);
			
			if(endTotal > current){
				if (ExternalInterface.available)
				{
					ExternalInterface.call("onFlashTick", _totalDuration, _currentPosition);
				}			
			}else{
				onVideoComplete();
			}
			trace("onTick", video.name, endTotal,current);
		}
		
		public function onVideoComplete(){
			this.removeEventListener(Event.ENTER_FRAME,onTick);
			trace("onVideoComplete", _currentPosition);
			
			if (ExternalInterface.available)
			{
				ExternalInterface.call("onFlashVideoComplete",_totalDuration, _currentPosition);
			}
		}
		
		public function playVideo(t:Number = 0):void{
			vidStream.seek(t);
			vidStream.play(_url);
			vidStream.soundTransform = new SoundTransform(0);
		}
		
		public function setVolume(vol:Number):void{
			vidStream.soundTransform = new SoundTransform(vol);
		}
		
		public function pauseVideo():void{
			vidStream.pause();
		}
		
		public function resumeVideo():void{
			vidStream.togglePause();
		}
		
		public function getDuration():Number{
			return _totalDuration;
		}
		
		public function getCurrentTime():Number{
			return _currentPosition;
		}
		
		public function seekToInVideo(t):void{
			vidStream.seek(t);
		}
	}
}